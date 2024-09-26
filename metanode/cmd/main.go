package main

import (
	"log"

	"metanode/cmd/api"
)

func main() {
	server := api.NewApiServer(":8080", nil)

	if err := server.Run(); err != nil {
		log.Fatal(err)
	}
}
