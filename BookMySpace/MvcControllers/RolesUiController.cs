// using BookMySpace.Models;
// using BookMySpace.Services;
// using Microsoft.AspNetCore.Mvc;
//
// namespace BookMySpace.MvcControllers;
//
// public class RolesUiController : Controller
// {
//     private readonly ApiClient _api;
//
//     public RolesUiController(ApiClient api) => _api = api;
//
//     public async Task<IActionResult> Index()
//     {
//         var roles = await _api.GetAllAsync<Role>("api/roles");
//         return View(roles);
//     }
//     
// }

using System.Net.Http.Json;
using BookMySpace.Models;
using Microsoft.AspNetCore.Mvc;

namespace BookMySpace.MvcControllers
{
    public class RolesUiController : Controller
    {
        private readonly HttpClient _http;

        public RolesUiController(IHttpClientFactory factory)
        {
            _http = factory.CreateClient();
            _http.BaseAddress = new Uri("http://localhost:5203/"); 
        }
        
        public async Task<IActionResult> Index()
        {
            var roles = await _http.GetFromJsonAsync<List<Role>>("api/roles");
            return View(roles);
        }
        
        public async Task<IActionResult> Details(int id)
        {
            var role = await _http.GetFromJsonAsync<Role>($"api/roles/{id}");
            if (role == null) return NotFound();
            return View(role);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(AddUpdateRoleDTO dto)
        {
            if (!ModelState.IsValid)
                return View(dto);

            var response = await _http.PostAsJsonAsync("api/roles", dto);

            if (!response.IsSuccessStatusCode)
            {
                ViewBag.Error = await response.Content.ReadAsStringAsync();
                return View(dto);
            }

            return RedirectToAction(nameof(Index));
        }
        
        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var role = await _http.GetFromJsonAsync<Role>($"api/roles/{id}");
            if (role == null) return NotFound();

            var dto = new AddUpdateRoleDTO
            {
                RoleName = role.RoleName
            };

            ViewBag.RoleId = role.RoleId;
            return View(dto);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, AddUpdateRoleDTO dto)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.RoleId = id;
                return View(dto);
            }

            var response = await _http.PutAsJsonAsync($"api/roles/{id}", dto);

            if (!response.IsSuccessStatusCode)
            {
                ViewBag.Error = await response.Content.ReadAsStringAsync();
                ViewBag.RoleId = id;
                return View(dto);
            }

            return RedirectToAction(nameof(Index));
        }

        // ✅ DELETE GET
        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            var role = await _http.GetFromJsonAsync<Role>($"api/roles/{id}");
            if (role == null) return NotFound();

            return View(role);
        }

        // ✅ DELETE POST
        [HttpPost]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var response = await _http.DeleteAsync($"api/roles/{id}");

            if (!response.IsSuccessStatusCode)
            {
                TempData["Error"] = await response.Content.ReadAsStringAsync();
                return RedirectToAction(nameof(Delete), new { id });
            }

            return RedirectToAction(nameof(Index));
        }
    }
}