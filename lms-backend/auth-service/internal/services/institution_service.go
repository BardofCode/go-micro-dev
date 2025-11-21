// internal/services/institution_service.go
package services

import (
	"auth-service/internal/models"
	"auth-service/internal/repositories"
)

type InstitutionService struct {
	repo *repositories.InstitutionRepository
}

func NewInstitutionService(repo *repositories.InstitutionRepository) *InstitutionService {
	return &InstitutionService{repo: repo}
}

func (s *InstitutionService) CreateInstitution(inst *models.Institution) error {
	return s.repo.Create(inst)
}

func (s *InstitutionService) GetByID(id string) (*models.Institution, error) {
	return s.repo.FindByID(id)
}

// NEW: Get institution based on admin user ID
func (s *InstitutionService) GetByUserID(userID string) (*models.Institution, error) {
	return s.repo.FindByUserID(userID)
}
