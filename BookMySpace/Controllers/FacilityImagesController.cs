using BookMySpace.Data;
using BookMySpace.Models;
using BookMySpace.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class FacilityImagesController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IFileService _fileService;
    
    public FacilityImagesController(AppDbContext db, IFileService fileService)
    {
        _db = db;
        _fileService = fileService;
    }
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var images = await _db.FacilityImages
            .Include(i => i.Facility)
            .Select(i => new
            {
                i.ImageId,
                i.ImageUrl,
                i.FacilityId,
                FacilityName = i.Facility.Name,
                Category = i.Facility.Category
            })
            .ToListAsync();

        return Ok(images);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var img = await _db.FacilityImages.FindAsync(id);
        if (img == null)
            return NotFound();

        return Ok(img);
    }
    
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] AddUpdateFacilityImageDTO dto)
    {
        if (dto.FacilityId <= 0)
            return BadRequest(new { message = "FacilityId is required" });
        
        //checking if file path exists
        if (dto.ImageFile == null || dto.ImageFile.Length == 0)
            return BadRequest(new { message = "ImageFile is required" });
        
        string? filePath = null;
        if (dto.ImageFile != null)
        {
            filePath = await _fileService.UploadFileAsync(dto.ImageFile, "FacilityImages");
        }
        var img = new FacilityImage
        {
            FacilityId = dto.FacilityId,
            ImageUrl = filePath
        };
        _db.FacilityImages.Add(img);
        await _db.SaveChangesAsync();
        return Ok(img);
    }
    
    // [HttpPut("{id:int}")]
    // public async Task<IActionResult> Update(int id, [FromForm] AddUpdateFacilityImageDTO dto)
    // {
    //     if (dto.FacilityId <= 0)
    //         return BadRequest(new { message = "FacilityId is required" });
    //
    //     var existing = await _db.FacilityImages.FindAsync(id);
    //     if (existing == null)
    //         return NotFound(new { message = "Facility image not found" });
    //
    //     // Replace file only if new file is provided
    //     if (dto.ImageFile != null && dto.ImageFile.Length > 0)
    //     {
    //         // delete old file
    //         _fileService.DeleteFile(existing.ImageUrl);
    //
    //         // upload new file
    //         existing.ImageUrl = await _fileService.UploadFileAsync(dto.ImageFile, "FacilityImages");
    //     }
    //     else
    //     {
    //         return BadRequest(new { message = "ImageFile is required to update image" });
    //     }
    //
    //     // update FacilityId also
    //     existing.FacilityId = dto.FacilityId;
    //
    //     await _db.SaveChangesAsync();
    //
    //     return Ok(existing);
    // }
    
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var img = await _db.FacilityImages.FindAsync(id);
        if (img == null) return NotFound();
        
        // Delete associated file
        _fileService.DeleteFile(img.ImageUrl);

        _db.FacilityImages.Remove(img);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Image deleted" });
    }
}
