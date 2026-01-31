using BookMySpace.Models;

public interface IAuthService
{
    Task<object?> LoginAsync(string username, string password);
    string GenerateJwtToken(User user);
}