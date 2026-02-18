// namespace BookMySpace.Validators;
//
// using FluentValidation;
//
// public class DocumentValidator : AbstractValidator<AddUpdateDocumentDTO>
// {
//     public DocumentValidator()
//     {
//         RuleFor(nameOfDto => nameOfDto.FacilityId)
//             .GreaterThan(0);
//
//         RuleFor(nameOfDto => nameOfDto.DocumentType)
//             .NotEmpty()
//             .MaximumLength(100);
//
//         RuleFor(nameOfDto => nameOfDto.FileUrl)
//             .NotEmpty()
//             .MaximumLength(500);
//     }
// }


using FluentValidation;
using BookMySpace.Models;

namespace BookMySpace.Validators
{
    public class DocumentValidator : AbstractValidator<AddUpdateDocumentDTO>
    {
        public DocumentValidator()
        {
            RuleFor(x => x.FacilityId)
                .GreaterThan(0).WithMessage("Facility is required");

            RuleFor(x => x.DocumentType)
                .NotEmpty().WithMessage("Document type is required")
                .MaximumLength(100);

            //  File validation instead of FileUrl
            RuleFor(x => x.File)
                .NotNull().WithMessage("File is required")
                .Must(file => file.Length <= 10 * 1024 * 1024)
                .WithMessage("File size must be less than 10MB");
        }
    }
}

//
// using FluentValidation;
//
// namespace BookMySpace.Validators;
//
// public class DocumentValidator : AbstractValidator<AddUpdateDocumentDTO>
// {
//     public DocumentValidator()
//     {
//         RuleFor(nameOfDto => nameOfDto.FacilityId)
//             .GreaterThan(0)
//             .WithMessage("Facility is required");
//
//         RuleFor(nameOfDto => nameOfDto.DocumentType)
//             .NotEmpty()
//             .MaximumLength(100)
//             .WithMessage("Document type is required");
//
//         // validate file instead of FileUrl
//         RuleFor(nameOfDto => nameOfDto.File)
//             .NotNull()
//             .WithMessage("File is required");
//
//         RuleFor(nameOfDto => nameOfDto.File)
//             .Must(file => file == null || file.Length <= 10 * 1024 * 1024)
//             .WithMessage("File size must be less than 10MB");
//
//         RuleFor(nameOfDto => nameOfDto.File)
//             .Must(file =>
//             {
//                 if (file == null) return true;
//                 var allowed = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
//                 var ext = Path.GetExtension(file.FileName).ToLower();
//                 return allowed.Contains(ext);
//             })
//             .WithMessage("Only PDF, JPG, JPEG, PNG allowed");
//     }
// }