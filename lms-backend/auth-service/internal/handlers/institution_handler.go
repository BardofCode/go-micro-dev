package handlers

import (
	"auth-service/internal/auth"
	"auth-service/internal/models"
	"auth-service/internal/repositories"
	"auth-service/internal/services"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type InstitutionHandler struct {
	service *services.InstitutionService
}

func NewInstitutionHandler(db *gorm.DB) *InstitutionHandler {
	repo := repositories.NewInstitutionRepository(db)
	service := services.NewInstitutionService(repo)
	return &InstitutionHandler{service}
}

func (h *InstitutionHandler) CreateInstitution(c *fiber.Ctx) error {
	var inst models.Institution
	if err := c.BodyParser(&inst); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid body"})
	}

	// 💡 TAKE USER_ID FROM JWT (Not from body)
	claims := c.Locals("claims").(*auth.Claims) // middleware must store it
	inst.UserID = uuid.MustParse(claims.UserID)

	if inst.Settings == nil {
		inst.Settings = datatypes.JSON([]byte("{}"))
	}

	if err := h.service.CreateInstitution(&inst); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to save institution", "details": err.Error()})
	}

	return c.Status(201).JSON(inst)
}

func (h *InstitutionHandler) GetByID(c *fiber.Ctx) error {
	id := c.Params("id")
	claims := c.Locals("claims").(*auth.Claims)

	// STUDENT CAN ONLY VIEW THEIR OWN INSTITUTION
	if claims.Role == "STUDENT" {
		inst, err := h.service.GetByUserID(claims.UserID)
		if err != nil || inst.ID.String() != id {
			return c.Status(403).JSON(fiber.Map{"error": "Access denied"})
		}
	}

	inst, err := h.service.GetByID(id)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Institution not found"})
	}
	return c.JSON(inst)
}
