using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BookMySpace.Models
{
    public class FacilityImage
    {
        [Key]
        public int ImageId { get; set; }

        [Required]
        public int FacilityId { get; set; }

        [ForeignKey(nameof(FacilityId))]
        public Facility? Facility { get; set; }

        [Required, MaxLength(500)]
        public string ImageUrl { get; set; }
    }
}

public class AddUpdateFacilityImageDTO
{
    public int FacilityId { get; set; }
    public string ImageUrl { get; set; }
}