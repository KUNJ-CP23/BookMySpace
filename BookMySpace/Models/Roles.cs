using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BookMySpace.Models
{
    public class Role
    {
        [Key]
        public int RoleId { get; set; }
        
        [Required, MaxLength(50)]
        public string RoleName { get; set; }
        
        public ICollection<User> Users { get; set; }
    }
    // public class AddUpdateRoleDTO
    // {
    //     // [Required, MaxLength(50)]
    //     public string RoleName { get; set; }
    // }
}
public class AddUpdateRoleDTO
{
    // [Required, MaxLength(50)]
    public string RoleName { get; set; }
}