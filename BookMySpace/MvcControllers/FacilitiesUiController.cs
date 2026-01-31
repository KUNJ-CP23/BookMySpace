using BookMySpace.Models;
using BookMySpace.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookMySpace.MvcControllers;

public class FacilitiesUiController : Controller
{
    private readonly ApiClient _api;

    public FacilitiesUiController(ApiClient api) => _api = api;

    public async Task<IActionResult> Index()
    {
        var facilities = await _api.GetAllAsync<Facility>("api/facilities");
        return View(facilities);
    }
}