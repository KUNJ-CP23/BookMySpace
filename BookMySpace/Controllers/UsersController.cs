using BookMySpace.Data;
using BookMySpace.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using BookMySpace.Services;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IAuthService _authService;

    public UsersController(AppDbContext db, IAuthService authService)
    {
        _db = db;
        _authService = authService;
    }
    
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDTO dto)
    {
        var result = await _authService.LoginAsync(dto.Email, dto.Password);

        if (result == null)
            return Unauthorized(new { message = "Invalid credentials" });

        return Ok(result);
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _db.Users.Include(u => u.Role).ToListAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Create(AddUpdateUserDTO dto)
    {
        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Password = dto.Password,
            RoleId = dto.RoleId,
            Phone = dto.Phone
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return Ok(user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AddUpdateUserDTO dto)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.FullName = dto.FullName;
        user.Email = dto.Email;
        user.Password = dto.Password;
        user.RoleId = dto.RoleId;
        user.Phone = dto.Phone;

        await _db.SaveChangesAsync();
        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return NotFound();

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        return Ok(new { message = "User deleted" });
    }
}