using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BookMySpace.Models
{
    public class Document
    {
        [Key]
        public int DocumentId { get; set; }

        [Required]
        public int FacilityId { get; set; }

        [ForeignKey(nameof(FacilityId))]
        public Facility Facility { get; set; }

        //License ne a vu
        [Required, MaxLength(100)]
        public string DocumentType { get; set; }

        [Required, MaxLength(500)]
        public string FileUrl { get; set; }

        public DateTime UploadedAt { get; set; } = DateTime.Now;
    }
}

public class AddUpdateDocumentDTO
{
    // [Required]
    public int FacilityId { get; set; }
    // [Required, MaxLength(100)]
    public string DocumentType { get; set; }
    // [Required, MaxLength(500)]
    public string FileUrl { get; set; }
}