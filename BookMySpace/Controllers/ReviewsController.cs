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
        => Ok(await _db.Reviews.ToListAsync());
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var review = await _db.Reviews.FindAsync(id);
        if (review == null)
            return NotFound();

        return Ok(review);
    }

    [HttpPost]
    public async Task<IActionResult> Create(AddUpdateReviewDTO dto)
    {
        var r = new Review
        {
            FacilityId = dto.FacilityId,
            UserId = dto.UserId,
            Rating = dto.Rating,
            Comment = dto.Comment
        };

        _db.Reviews.Add(r);
        await _db.SaveChangesAsync();
        return Ok(r);
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