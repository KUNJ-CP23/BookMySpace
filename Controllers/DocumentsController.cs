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

    [HttpPost]
    public async Task<IActionResult> Create(AddUpdateDocumentDTO dto)
    {
        var d = new Document
        {
            FacilityId = dto.FacilityId,
            DocumentType = dto.DocumentType,
            FileUrl = dto.FileUrl
        };

        _db.Documents.Add(d);
        await _db.SaveChangesAsync();
        return Ok(d);
    }
    // GET api/documents/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var doc = await _db.Documents.FindAsync(id);
        if (doc == null)
            return NotFound();

        return Ok(doc);
    }

    // PUT api/documents/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, AddUpdateDocumentDTO dto)
    {
        var doc = await _db.Documents.FindAsync(id);
        if (doc == null)
            return NotFound();

        doc.FacilityId = dto.FacilityId;
        doc.DocumentType = dto.DocumentType;
        doc.FileUrl = dto.FileUrl;

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