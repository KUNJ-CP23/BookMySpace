using BookMySpace.Models;
using BookMySpace.Services;
using Microsoft.AspNetCore.Mvc;

namespace BookMySpace.MvcControllers;

public class DocumentsUiController : Controller
{
    private readonly ApiClient _api;

    public DocumentsUiController(ApiClient api) => _api = api;

    public async Task<IActionResult> Index()
    {
        var docs = await _api.GetAllAsync<Document>("api/documents");
        return View(docs);
    }
}