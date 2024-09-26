package db

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5"
)

func PostgreSqlStorage(cfg po) {
	conn, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Printf(os.Stderr, "Unable to connect to database %v\n", err)
		os.Exit(1)
	}
}
