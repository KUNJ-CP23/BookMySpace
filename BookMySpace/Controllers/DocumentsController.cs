using BookMySpace.Data;
using BookMySpace.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class DocumentsController : ControllerBase
{
    private readonly AppDbContext _db;
    public DocumentsController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _db.Documents.ToListAsync());
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var doc = await _db.Documents.FindAsync(id);
        if (doc == null)
            return NotFound();

        return Ok(doc);
    }

    // [HttpPost]
    // public async Task<IActionResult> Create(AddUpdateDocumentDTO dto)
    // {
    //     var d = new Document
    //     {
    //         FacilityId = dto.FacilityId,
    //         DocumentType = dto.DocumentType,
    //         FileUrl = dto.FileUrl
    //     };
    //
    //     _db.Documents.Add(d);
    //     await _db.SaveChangesAsync();
    //     return Ok(d);
    // }
    
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] AddUpdateDocumentDTO dto)
    {
        string? filePath = null;

        if (dto.File != null)
        {
            var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Documents");

            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            var fileName = Guid.NewGuid() + Path.GetExtension(dto.File.FileName);
            var fullPath = Path.Combine(folder, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            filePath = "/Documents/" + fileName;
        }

        var d = new Document
        {
            FacilityId = dto.FacilityId,
            DocumentType = dto.DocumentType,
            FileUrl = filePath // ✅ correct now
        };

        _db.Documents.Add(d);
        await _db.SaveChangesAsync();

        return Ok(d);
    }
    
    // [HttpPut("{id}")]
    // public async Task<IActionResult> Update(int id, AddUpdateDocumentDTO dto)
    // {
    //     var doc = await _db.Documents.FindAsync(id);
    //     if (doc == null)
    //         return NotFound();
    //
    //     doc.FacilityId = dto.FacilityId;
    //     doc.DocumentType = dto.DocumentType;
    //     doc.FileUrl = dto.FileUrl;
    //
    //     await _db.SaveChangesAsync();
    //
    //     return Ok(doc);
    // }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromForm] AddUpdateDocumentDTO dto)
    {
        var doc = await _db.Documents.FindAsync(id);
        if (doc == null)
            return NotFound();

        // If new file uploaded
        if (dto.File != null)
        {
            var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Documents");

            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            var fileName = Guid.NewGuid() + Path.GetExtension(dto.File.FileName);
            var fullPath = Path.Combine(folder, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            doc.FileUrl = "/Documents/" + fileName; // replace file
        }

        doc.FacilityId = dto.FacilityId;
        doc.DocumentType = dto.DocumentType;

        await _db.SaveChangesAsync();

        return Ok(doc);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var d = await _db.Documents.FindAsync(id);
        if (d == null) return NotFound();

        _db.Documents.Remove(d);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Document deleted" });
    }
}