using BookMySpace.Models;
using BookMySpace.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookMySpace.MvcControllers;

public class UsersUiController : Controller
{
    private readonly ApiClient _api;

    public UsersUiController(ApiClient api) => _api = api;

    public async Task<IActionResult> Index()
    {
        var users = await _api.GetAllAsync<User>("api/users");
        return View(users);
    }
}