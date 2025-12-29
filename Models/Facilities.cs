using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookMySpace.Models
{
    
    //Facility (1)
    // ├── (Many) FacilityImages
    // ├── (Many) Reviews
    
    //upar na relation na lidhe reviews and facility images have nothing to do with each other
    
    public class Facility
    {
        [Key]
        public int FacilityId { get; set; }

        [Required]
        public int UserId { get; set; }

        //aa niche User datatype atle che cuz it represents the whole User object
        [ForeignKey(nameof(UserId))]
        public User User { get; set; }

        [Required, MaxLength(150)]
        public string Name { get; set; }
        
        [MaxLength(20)]
        public string Contact { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        [Required, MaxLength(100)]
        public string City { get; set; }

        [MaxLength(300)]
        public string Address { get; set; }

        [Required, MaxLength(50)]
        public string Category { get; set; }

        public decimal PricePerHour { get; set; }

        public bool IsGovOwned { get; set; }

        public bool IsApproved { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
        
        public ICollection<FacilityImage> FacilityImages { get; set; }
        public ICollection<Booking> Bookings { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<Document> Documents { get; set; }
    }
}

public class AddUpdateFacilityDTO
{
    public int OwnerId { get; set; }
    public string Name { get; set; }
    public string Contact { get; set; }
    public string Description { get; set; }
    public string City { get; set; }
    public string Address { get; set; }
    public string Category { get; set; }
    public decimal PricePerHour { get; set; }
    public bool IsGovOwned { get; set; }
}