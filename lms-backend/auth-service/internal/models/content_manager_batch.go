package models

import (
	"time"

	"github.com/google/uuid"
)

type ContentManagerBatch struct {
	ID               uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()"`
	ContentManagerID uuid.UUID `gorm:"type:uuid;not null;index"`
	BatchID          uuid.UUID `gorm:"type:uuid;not null;index"`
	AssignedBy       uuid.UUID `gorm:"type:uuid;not null"`
	AssignedAt       time.Time `gorm:"autoCreateTime"`

	ContentManager ContentManager `gorm:"foreignKey:ContentManagerID"`
	Batch          Batch          `gorm:"foreignKey:BatchID"`
	Assigner       User           `gorm:"foreignKey:AssignedBy"`
}
