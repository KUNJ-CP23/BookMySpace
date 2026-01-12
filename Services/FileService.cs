using Microsoft.AspNetCore.Http;

namespace BookMySpace.Services
{
    public interface IFileService
    {
        Task<string> UploadImageAsync(IFormFile file, string subFolder);
        void DeleteFile(string? relativePath);
    }

    public class FileService : IFileService
    {
        private readonly string _basePath;
        private readonly string _uploadsFolder = "Uploads";

        public FileService()
        {
            _basePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", _uploadsFolder);
        }

        public async Task<string> UploadImageAsync(IFormFile file, string subFolder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty");

            // ✅ Allow only images
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
                throw new ArgumentException($"Invalid file type. Allowed: {string.Join(", ", allowedExtensions)}");

            // ✅ Max size 10MB
            if (file.Length > 10 * 1024 * 1024)
                throw new ArgumentException("File exceeds 10MB");

            // Create folder
            var folderPath = Path.Combine(_basePath, subFolder);
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            // Generate unique name
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(folderPath, fileName);

            // Save file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // return relative path for DB
            return Path.Combine(_uploadsFolder, subFolder, fileName).Replace("\\", "/");
        }

        public void DeleteFile(string? relativePath)
        {
            if (string.IsNullOrWhiteSpace(relativePath))
                return;

            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", relativePath);

            if (File.Exists(fullPath))
            {
                try
                {
                    File.Delete(fullPath);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to delete file: {fullPath}. Error: {ex.Message}");
                }
            }
        }
    }
}