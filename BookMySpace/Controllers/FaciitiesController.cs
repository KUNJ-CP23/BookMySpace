using BookMySpace.Data;
using BookMySpace.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize(Roles = "Owner,Admin,Customer")]
[ApiController]
[Route("api/[controller]")]
public class FacilitiesController : ControllerBase
{
    private readonly AppDbContext _db;
    public FacilitiesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _db.Facilities.Include(f => f.User).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var f = await _db.Facilities.FindAsync(id);
        if (f == null) return NotFound();
        return Ok(f);
    }

    [HttpPost]
    public async Task<IActionResult> Create(AddUpdateFacilityDTO dto)
    {
        var f = new Facility
        {
            UserId = dto.UserId,
            Name = dto.Name,
            Contact = dto.Contact,
            Description = dto.Description,
            City = dto.City,
            Address = dto.Address,
            Category = dto.Category,
            PricePerHour = dto.PricePerHour,
            IsGovOwned = dto.IsGovOwned
        };

        _db.Facilities.Add(f);
        await _db.SaveChangesAsync();
        return Ok(f);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AddUpdateFacilityDTO dto)
    {
        var f = await _db.Facilities.FindAsync(id);
        if (f == null) return NotFound();

        f.UserId = dto.UserId;
        f.Name = dto.Name;
        f.Contact = dto.Contact;
        f.Description = dto.Description;
        f.City = dto.City;
        f.Address = dto.Address;
        f.Category = dto.Category;
        f.PricePerHour = dto.PricePerHour;
        f.IsGovOwned = dto.IsGovOwned;

        await _db.SaveChangesAsync();
        return Ok(f);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var f = await _db.Facilities.FindAsync(id);
        if (f == null) return NotFound();
        _db.Facilities.Remove(f);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Facility deleted" });
    }
}