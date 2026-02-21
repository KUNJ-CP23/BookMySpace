using BookMySpace.Data;
using BookMySpace.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    private readonly AppDbContext _db;

    public RolesController(AppDbContext db)
    {
        _db = db;
    }

    // GET: api/roles
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var roles = await _db.Roles.ToListAsync();
        return Ok(roles);
    }

    // GET: api/roles/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var role = await _db.Roles.FindAsync(id);
        if (role == null)
            return NotFound(new { message = "Role not found" });

        return Ok(role);
    }

    // POST: api/roles
    [HttpPost]
    public async Task<IActionResult> Create(AddUpdateRoleDTO dto)
    {
        bool exists = await _db.Roles.AnyAsync(r => r.RoleName == dto.RoleName);
        if (exists)
            return BadRequest(new { message = "Role already exists" });

        var role = new Role
        {
            RoleName = dto.RoleName
        };

        _db.Roles.Add(role);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = role.RoleId }, role);
    }

    // PUT: api/roles/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AddUpdateRoleDTO dto)
    {
        var existing = await _db.Roles.FindAsync(id);
        if (existing == null)
            return NotFound(new { message = "Role not found" });

        existing.RoleName = dto.RoleName;

        await _db.SaveChangesAsync();

        return Ok(existing);
    }

    // DELETE: api/roles/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var role = await _db.Roles.FindAsync(id);
        if (role == null)
            return NotFound(new { message = "Role not found" });

        _db.Roles.Remove(role);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Role deleted successfully" });
    }
}