using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BookMySpace.Migrations
{
    /// <inheritdoc />
    public partial class AddPaymentModeAndStatusInBooking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "TransactionId",
                table: "Payments",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AlterColumn<string>(
                name: "Remarks",
                table: "Payments",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AlterColumn<string>(
                name: "OfflineReferenceNumber",
                table: "Payments",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200);

            migrationBuilder.AddColumn<string>(
                name: "PaymentMode",
                table: "Bookings",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PaymentStatus",
                table: "Bookings",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Bookings",
                keyColumn: "BookingId",
                keyValue: 1,
                columns: new[] { "CreatedAt", "PaymentMode", "PaymentStatus" },
                values: new object[] { new DateTime(2026, 1, 20, 13, 57, 2, 632, DateTimeKind.Local).AddTicks(6200), "Online", "Unpaid" });

            migrationBuilder.UpdateData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 57, 2, 632, DateTimeKind.Local).AddTicks(6170));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "ReviewId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 57, 2, 632, DateTimeKind.Local).AddTicks(6210));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 57, 2, 632, DateTimeKind.Local).AddTicks(6150));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 57, 2, 632, DateTimeKind.Local).AddTicks(6150));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 57, 2, 632, DateTimeKind.Local).AddTicks(6150));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaymentMode",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "PaymentStatus",
                table: "Bookings");

            migrationBuilder.AlterColumn<string>(
                name: "TransactionId",
                table: "Payments",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Remarks",
                table: "Payments",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "OfflineReferenceNumber",
                table: "Payments",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(200)",
                oldMaxLength: 200,
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Bookings",
                keyColumn: "BookingId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 19, 37, 450, DateTimeKind.Local).AddTicks(6930));

            migrationBuilder.UpdateData(
                table: "Facilities",
                keyColumn: "FacilityId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 19, 37, 450, DateTimeKind.Local).AddTicks(6900));

            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "ReviewId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 19, 37, 450, DateTimeKind.Local).AddTicks(6940));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 19, 37, 450, DateTimeKind.Local).AddTicks(6870));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 19, 37, 450, DateTimeKind.Local).AddTicks(6880));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 1, 20, 13, 19, 37, 450, DateTimeKind.Local).AddTicks(6880));
        }
    }
}
