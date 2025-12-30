using FluentValidation;
namespace BookMySpace.Validators;

public class RolesValidator : AbstractValidator<AddUpdateRoleDTO>
{
    public RolesValidator()
    {
        RuleFor(x => x.RoleName)
            .NotEmpty().WithMessage("Role name is required")
            .MinimumLength(1).WithMessage("Role name must contain at least 1 character")
            .MaximumLength(50).WithMessage("Role name cannot exceed 50 characters");
    }
}