using BookMySpace.Data;
using BookMySpace.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ReviewsController(AppDbContext db) => _db = db;
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var reviews = await _db.Reviews
            .Include(r => r.User)
            .Include(r => r.Facility)
            .ToListAsync();

        return Ok(reviews);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var review = await _db.Reviews
            .Include(r => r.User)
            .Include(r => r.Facility)
            .FirstOrDefaultAsync(r => r.ReviewId == id);

        if (review == null)
            return NotFound();

        return Ok(review);
    }

    //aa m work karse k agar property select thay gai to je user a property use or book kari hase 
    // a ne j review aapva dese, kem k in real life also use karya vagar kaay bolvu no joi
    [HttpPost]
    public async Task<IActionResult> Create(AddUpdateReviewDTO dto)
    {
        // Check if user has booked this facility before
        bool hasBooking = await _db.Bookings.AnyAsync(b =>
            b.UserId == dto.UserId &&
            b.FacilityId == dto.FacilityId);   // or remove this line if no status logic yet

        if (!hasBooking)
            return BadRequest(new { message = "User cannot review a facility they have not booked." });

        // Optional: Prevent multiple reviews by same user for same facility
        bool alreadyReviewed = await _db.Reviews.AnyAsync(r =>
            r.UserId == dto.UserId &&
            r.FacilityId == dto.FacilityId);

        if (alreadyReviewed)
            return BadRequest(new { message = "User has already reviewed this facility." });

        //Create Review
        var review = new Review
        {
            UserId = dto.UserId,
            FacilityId = dto.FacilityId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.Now
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync();

        return Ok(review);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AddUpdateReviewDTO dto)
    {
        var review = await _db.Reviews.FindAsync(id);
        if (review == null)
            return NotFound();

        review.Rating = dto.Rating;
        review.Comment = dto.Comment;

        await _db.SaveChangesAsync();
        return Ok(review);
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var r = await _db.Reviews.FindAsync(id);
        if (r == null) return NotFound();

        _db.Reviews.Remove(r);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Review deleted" });
    }
}