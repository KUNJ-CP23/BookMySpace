using BookMySpace.Models;
using BookMySpace.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookMySpace.MvcControllers;

public class ReviewsUiController : Controller
{
    private readonly ApiClient _api;

    public ReviewsUiController(ApiClient api) => _api = api;

    public async Task<IActionResult> Index()
    {
        var reviews = await _api.GetAllAsync<Review>("api/reviews");
        return View(reviews);
    }
}