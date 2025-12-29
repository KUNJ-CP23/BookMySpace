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
    public async Task<IActionResult> GetAll()
        => Ok(await _db.Bookings.ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create(AddUpdateBookingDTO dto)
    {
        var b = new Booking
        {
            FacilityId = dto.FacilityId,
            UserId = dto.UserId,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime
        };

        _db.Bookings.Add(b);
        await _db.SaveChangesAsync();
        return Ok(b);
    }
    
    // GET api/bookings/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var booking = await _db.Bookings.FindAsync(id);
        if (booking == null)
            return NotFound();

        return Ok(booking);
    }

    // PUT api/bookings/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AddUpdateBookingDTO dto)
    {
        var booking = await _db.Bookings.FindAsync(id);
        if (booking == null)
            return NotFound();

        booking.FacilityId = dto.FacilityId;
        booking.UserId = dto.UserId;
        booking.StartDate = dto.StartDate;
        booking.EndDate = dto.EndDate;
        booking.StartTime = dto.StartTime;
        booking.EndTime = dto.EndTime;

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