package main

import (
	"github.com/gin-gonic/gin"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"os"
	"net/http"
	"strconv"
	"github.com/gin-gonic/contrib/static"
	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	jwt "github.com/dgrijalva/jwt-go"
)

type Response struct {
	Message string `json:"message"`
}
type Jwks struct {
	Keys []JSONWebKeys `json:"keys"`
}
type Seo struct {
	ID int `json:"id" binding:"required`
	Seos int `json:"seos"`
	Eunu string `json:"eunu", binding:"required"`

}

type JSONWebKeys struct {
	Kty string `json:"kty"`
	Kid string `json:"kid"`
	Use string `json:"use"`
	N string `json:"n"`
	E string `json:e"`
	X5c []string `json:x5c"`
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

var jwtMiddleWare *jwtmiddleware.JWTMiddleware

func main() {
	jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
			aud := os.Getenv("AUTHO_API_AUDIENCE")
			checkAudience := token.Claims.(jwt.MapClaims).VerifyAudience(aud, false)
			if !checkAudience {
				return token, errors.New("invalid audience.")
			}
		// verify iss claim
		iss := os.Getenv("AUTHO_DOMAIN")
		checkIss := token.Claims.(jwt.Mapclaims).VerifyIssuer(iss, false)
		if !checkIss {
			return token, errors.New("Invalid issuer")
		}

		cert, err := getPemCert(token)
		if err != nil {
			log.Fatalf("could not get cert: %+v", err)
		}

		result, _ := jwt.ParseRSAPublicFromPEM([]byte(cert))
		return result, nil
	},
		SigningMethod: jwt.SigningMethodRS256,
	})

	jwtMiddleware = jwtMiddleWare
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
	api.GET("/seo", authMiddleware(), SeoHandler)   // /api/seo
	api.POST("/seo/eunu/:seoID", authMiddleware(), LikeSeo) // /api/seo/eunu/

	r.Run() // localhost:8080
}

func getPemCert(token *jwt.Token) (string, error) {
	cert := ""
	resp, err := http.Get(os.Getenv("AUTHO_DOMAIN") + ".well-known/jwks.joson")
	if err != nil {
		return cert, err
	}
	defer resp.Body.Close()

	var jwks = Jwks{}
	err = json.NewDecoder(resp.Body).Decode(&jwks)

	if err != nil {
		return cert, err
	}

	x5c := jwks.Keys[0].X5c
	for k, v := range x5c {
		if token.Header["kid"] == jwks.Keys[k].Kid {
			cert = "-----------BEGIN CERTIFICATE-----------\n" + v + "\n-----------END CRETIFICATE--------"
		}
	}

	if cert == "" {
		return cert, errors.New("unable to find appropriate key.")
	}

	return cert, nil
}
// authMiddleware intercepts the requests, and check for a valid jwt token
func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the client secret key
		err := jwtMiddleWare.CheckJWT(c.Writer, c.Request)
		if err != nil {
			//Token not found
			fmt.Println(err)
			c.Abort()
			c.Writer.WriteHeader(http.StatusUnauthorized)
			c.Writer.Write([]byte("Unauthorized"))
			return
		}
	}
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