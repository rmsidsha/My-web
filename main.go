package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"github.com/gin-gonic/contrib/static"
)

type Seo struct {
	ID int `json:"id" binding:"required`
	Seos int `json:"seos"`
	Eunu string `json:"eunu", binding:"required"`

}

// Create List of Seo
var seos = []Seo{
	Seo{1, 0, "This is 1"},
	Seo{2, 0, "This is 2"},
	Seo{3, 0, "This is 3"},
	Seo{4, 0, "This is 4"},
	Seo{5, 0, "This is 5"},
	Seo{6, 0, "This is 6"},
	Seo{7, 0, "This is 7"},
}
func main() {
	r := gin.Default()
	// Serve frontend static files
	r.Use(static.Serve("/", static.LocalFile("./views", true)))

	// Setup route group for the API
	api := r.Group("/api")
	{
		api.GET("/", func(c *gin.Context){
			c.JSON(http.StatusOK, gin.H{
				"message":"pong",
			})
		})
	}
	api.GET("/seo", SeoHandler)   // /api/seo
	api.POST("/seo/eunu/:seoID", LikeSeo) // /api/seo/eunu/

	r.Run() // localhost:8080
}

func SeoHandler(c *gin.Context) {
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, seos)
}

func LikeSeo(c *gin.Context) {
	// Confirm Seo ID sent is valid
	// import to strvonc package
	if seoid, err := strconv.Atoi(c.Param("seoID")); err == nil {
		for i := 0; i<len(seos); i++ {
			if seos[i].ID == seoid {
				seos[i].Seos += 1
			}
		}
		
	// return a pointer to the updated seos list
		c.JSON(http.StatusOK, &seos)
	} else { // ID is invalid
		c.AbortWithStatus(http.StatusNotFound)
	}
}