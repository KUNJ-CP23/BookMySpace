using BookMySpace.Models;
using BookMySpace.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookMySpace.MvcControllers;

public class BookingsUiController : Controller
{
    private readonly ApiClient _api;

    public BookingsUiController(ApiClient api) => _api = api;

    public async Task<IActionResult> Index()
    {
        var bookings = await _api.GetAllAsync<Booking>("api/bookings");
        return View(bookings);
    }
}