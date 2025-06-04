using collections.Application;
using collectionsProject.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using collectionsProject.Services;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly CategoryService _categoryService;

    public CategoriesController(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet("user-categories")]
    public async Task<ActionResult<List<CategoryWithCharacteristicsDto>>> GetUserCategories()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _categoryService.GetUserCategoriesWithCharacteristicsAsync(userId);
        return Ok(result);
    }
    [HttpPost("add")]
    public async Task<IActionResult> AddCategory([FromBody] CreateCategoryDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        await _categoryService.AddCategoryAsync(userId, dto.NameCategory);
        return Ok(new { message = "Category added successfully" });
    }

    [HttpPut("rename")]
    public async Task<IActionResult> RenameCategory([FromBody] RenameCategoryDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _categoryService.RenameCategoryAsync(userId, dto.Idcategory, dto.NewName);
        return result ? Ok(new { message = "Category renamed" }) : NotFound(new { error = "Category not found or access denied" });
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> DeleteCategory([FromBody] DeleteCategoryDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var result = await _categoryService.DeleteCategoryAsync(userId, dto.Idcategory);
        return result ? Ok(new { message = "Category deleted" }) : NotFound(new { error = "Category not found or access denied" });
    }

}
