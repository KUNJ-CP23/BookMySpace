using BookMySpace.Data;
using BookMySpace.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class FacilityImagesController : ControllerBase
{
    private readonly AppDbContext _db;
    public FacilityImagesController(AppDbContext db) => _db = db;

    //below -> anonymous function
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _db.FacilityImages.ToListAsync());
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var img = await _db.FacilityImages.FindAsync(id);
        if (img == null)
            return NotFound();

        return Ok(img);
    }
    
    [HttpPost]
    public async Task<IActionResult> Create(AddUpdateFacilityImageDTO dto)
    {
        var img = new FacilityImage
        {
            FacilityId = dto.FacilityId,
            ImageUrl = dto.ImageUrl
        };
        _db.FacilityImages.Add(img);
        await _db.SaveChangesAsync();
        return Ok(img);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AddUpdateFacilityImageDTO dto)
    {
        var img = await _db.FacilityImages.FindAsync(id);
        if (img == null)
            return NotFound();

        img.FacilityId = dto.FacilityId;
        img.ImageUrl = dto.ImageUrl;

        await _db.SaveChangesAsync();
        return Ok(img);
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var img = await _db.FacilityImages.FindAsync(id);
        if (img == null) return NotFound();

        _db.FacilityImages.Remove(img);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Image deleted" });
    }
}
