namespace BookMySpace.Services;

public class ApiClient
{
    private readonly HttpClient _http;

    public ApiClient(IHttpClientFactory factory)
    {
        _http = factory.CreateClient();
        _http.BaseAddress = new Uri("http://localhost:5203/");
    }

    public async Task<List<T>?> GetAllAsync<T>(string endpoint)
    {
        return await _http.GetFromJsonAsync<List<T>>(endpoint);
    }
}