using FluentValidation;
namespace BookMySpace.Validators;

public class RolesValidator : AbstractValidator<AddUpdateRoleDTO>
{
    public RolesValidator()
    {
        RuleFor(x => x.RoleName)
            .NotEmpty().WithMessage("Role name is required")
            .MinimumLength(5).WithMessage("Role name must contain at least 1 character")
            .MaximumLength(50).WithMessage("Role name cannot exceed 50 characters");
    }
}


// this below cascade stop stuff works

// public RolesValidator()
// {
//     RuleFor(x => x.RoleName).Cascade(CascadeMode.Stop)
//         .NotEmpty().WithMessage("Role name is required")
//         .MinimumLength(5).WithMessage("Role name must contain at least 1 character")
//         .MaximumLength(50).WithMessage("Role name cannot exceed 50 characters");
// }