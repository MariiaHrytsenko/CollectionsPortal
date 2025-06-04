using collections.Application;
using collectionsProject.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetCategoriesByUserId(string userId)
    {
        var result = await _categoryService.GetCategoriesByUserIdAsync(userId);
        return Ok(result);
    }

    [HttpGet("category/{categoryId}/items")]
    public async Task<IActionResult> GetItemsByCategory(int categoryId)
    {
        var items = await _categoryService.GetItemsByCategoryAsync(categoryId);
        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var categoryId = await _categoryService.CreateCategoryAsync(dto);
        return Ok(categoryId);
    }



}
