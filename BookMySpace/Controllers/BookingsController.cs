using BookMySpace.Data;
using BookMySpace.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
    
[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly AppDbContext _db;
    public BookingsController(AppDbContext db) => _db = db;

    [HttpGet]
    //facility ne user aya add karela
    public async Task<IActionResult> GetAll()
        => Ok(await _db.Bookings
            .Include(b => b.Facility)
            .Include(b => b.User)
            .ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var booking = await _db.Bookings
            .Include(b => b.Facility)
            .Include(b => b.User)
            .FirstOrDefaultAsync(b => b.BookingId == id);

        if (booking == null)
            return NotFound();

        return Ok(booking);
    }

    [HttpPost]
    public async Task<IActionResult> Create(AddUpdateBookingDTO dto)
    {
        //new-> Load facility to check IsGovOwned
        var facility = await _db.Facilities.FindAsync(dto.FacilityId);
        
        var duration = dto.EndTime - dto.StartTime;
        var hours = duration.TotalHours;
        if (facility == null)
            return NotFound(new { message = "Facility not found" });

        var b = new Booking
        {
            FacilityId = dto.FacilityId,
            UserId = dto.UserId,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,

            // new
            PaymentMode = facility.IsGovOwned ? "Offline" : "Online",
            PaymentStatus = "Unpaid",

            // notecheck: TotalPrice should be calculated in logic (service/controller)
            TotalPrice = (decimal)hours * facility.PricePerHour
        };

        _db.Bookings.Add(b);
        await _db.SaveChangesAsync();
        return Ok(b);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AddUpdateBookingDTO dto)
    {
        var booking = await _db.Bookings.FindAsync(id);
        if (booking == null)
            return NotFound();

        // facility check if facility updated
        var facility = await _db.Facilities.FindAsync(dto.FacilityId);
        if (facility == null)
            return NotFound(new { message = "Facility not found" });

        booking.FacilityId = dto.FacilityId;
        booking.UserId = dto.UserId;
        booking.StartDate = dto.StartDate;
        booking.EndDate = dto.EndDate;
        booking.StartTime = dto.StartTime;
        booking.EndTime = dto.EndTime;

        // update payment mode again (if facility changed)
        booking.PaymentMode = facility.IsGovOwned ? "Offline" : "Online";

        await _db.SaveChangesAsync();
        return Ok(booking);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var b = await _db.Bookings.FindAsync(id);
        if (b == null) return NotFound();

        _db.Bookings.Remove(b);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Booking deleted" });
    }
}