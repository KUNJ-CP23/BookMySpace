using BookMySpace.Models;
using BookMySpace.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookMySpace.MvcControllers;

public class FacilityImagesUiController : Controller
{
    private readonly ApiClient _api;

    public FacilityImagesUiController(ApiClient api) => _api = api;

    public async Task<IActionResult> Index()
    {
        var images = await _api.GetAllAsync<FacilityImage>("api/facilityimages");
        return View(images);
    }
}