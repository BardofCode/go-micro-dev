package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ContentManager struct {
	UserID    uuid.UUID      `gorm:"type:uuid;primaryKey"`
	CreatedBy uuid.UUID      `gorm:"type:uuid;not null"` //remove
	IsActive  bool           `gorm:"default:true"`
	CreatedAt time.Time      `gorm:"autoCreateTime"`
	UpdatedAt time.Time      `gorm:"autoUpdateTime"`
	DeletedAt gorm.DeletedAt `gorm:"index"`

	User    User                  `gorm:"foreignKey:UserID"`
	Creator User                  `gorm:"foreignKey:CreatedBy"`
	Batches []ContentManagerBatch `gorm:"foreignKey:ContentManagerID"`
}
