using BookMySpace.Data;
using BookMySpace.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public PaymentsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _db.Payments
            .Include(p => p.Booking)
            .ThenInclude(b => b.Facility)
            .Include(p => p.User)
            .ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var payment = await _db.Payments
            .Include(p => p.Booking)
            .ThenInclude(b => b.Facility)
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.PaymentId == id);

        if (payment == null) return NotFound();
        return Ok(payment);
    }

    [HttpPost]
    public async Task<IActionResult> Create(AddUpdatePaymentDTO dto)
    {
        
        // ✅ ADD THIS LINE (VERY IMPORTANT)
        dto.OfflineReferenceNumber = null;
        var booking = await _db.Bookings
            .Include(b => b.Facility)
            .FirstOrDefaultAsync(b => b.BookingId == dto.BookingId);

        if (booking == null)
            return NotFound(new { message = "Booking not found" });

        // Govt facility => NO payments table entry
        if (booking.Facility != null && booking.Facility.IsGovOwned)
            return BadRequest(new { message = "Government owned facility payments are offline. Payment entry not allowed." });

        //Private facility => allow ONLINE payment only (auto set)
        var payment = new Payment
        {
            BookingId = dto.BookingId,
            UserId = dto.UserId,
            Amount = dto.Amount,

            PaymentType = "Online",                 
            PaymentMethod = dto.PaymentMethod,      // UPI/Card/NetBanking
            PaymentStatus = "Success",              // (or Pending based on your flow)

            TransactionId = dto.TransactionId,      // required for private
            OfflineReferenceNumber = null,          // always null

            Remarks = dto.Remarks,
            PaidAt = DateTime.Now
        };

        _db.Payments.Add(payment);

        // Mark booking paid
        booking.PaymentStatus = "Paid";

        await _db.SaveChangesAsync();
        return Ok(payment);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AddUpdatePaymentDTO dto)
    {
        
        // ✅ ADD THIS LINE (VERY IMPORTANT)
        dto.OfflineReferenceNumber = null;
        var payment = await _db.Payments
            .Include(p => p.Booking)
            .ThenInclude(b => b.Facility)
            .FirstOrDefaultAsync(p => p.PaymentId == id);

        if (payment == null) return NotFound();

        // ✅ Option 2: Payments only exist for private (non-gov) bookings
        if (payment.Booking?.Facility != null && payment.Booking.Facility.IsGovOwned)
            return BadRequest(new { message = "Government owned facility does not use payments table" });

        // ✅ Always Online for private payments
        payment.Amount = dto.Amount;
        payment.PaymentType = "Online";          // fixed
        payment.PaymentMethod = dto.PaymentMethod;
        payment.PaymentStatus = "Success";       // or dto.PaymentStatus if you want
        payment.TransactionId = dto.TransactionId;

        // ✅ offline fields never used
        payment.OfflineReferenceNumber = null;

        payment.Remarks = dto.Remarks;

        await _db.SaveChangesAsync();
        return Ok(payment);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var payment = await _db.Payments.FindAsync(id);
        if (payment == null) return NotFound();

        _db.Payments.Remove(payment);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Payment deleted" });
    }
}