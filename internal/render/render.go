package render //
import (
	"bytes"
	"errors"
	"fmt"
	"github.com/jose-garcia86/bookings/internal/config"
	"github.com/jose-garcia86/bookings/internal/models"
	"github.com/justinas/nosurf"
	"html/template"
	"log"
	"net/http"
	"path/filepath"
)

var app *config.AppConfig
var pathToTemplates = "./templates"

// NewRenderer sets the config for the template package
func NewRenderer(a *config.AppConfig) {
	app = a
}

func AddDefaultData(td *models.TemplateData, r *http.Request) *models.TemplateData {
	td.Flash = app.Session.PopString(r.Context(), "flash")
	td.Error = app.Session.PopString(r.Context(), "error")
	td.Warning = app.Session.PopString(r.Context(), "warning")
	td.CSRFToken = nosurf.Token(r)
	return td
}

// Template renders Html Template
func Template(w http.ResponseWriter, r *http.Request, tmpl string, td *models.TemplateData) error {
	var tc map[string]*template.Template
	var err error
	if app.UseCache {
		// Get the template cache from the app config
		tc = app.TemplateCache
	} else {
		tc, err = CreateTemplateCache()
		if err != nil {
			log.Fatal("could not create template cache")
		}
	}

	// Get requested template from cache
	t, ok := tc[tmpl]
	if !ok {
		return errors.New("could not get template from cache")
	}

	td = AddDefaultData(td, r)

	buf := new(bytes.Buffer)
	err = t.Execute(buf, td)
	if err != nil {
		log.Println(err)
	}
	// Render the template
	_, err = buf.WriteTo(w)
	if err != nil {
		log.Println("Error writing template to browser", err)
		return err
	}

	return nil
}

func CreateTemplateCache() (map[string]*template.Template, error) {
	cache := map[string]*template.Template{}

	// Get all the files named *.page.tmpl from ./templates folder
	pages, err := filepath.Glob(fmt.Sprintf("%s/*.page.tmpl", pathToTemplates))

	if err != nil {
		return cache, err
	}

	// Range through all files ending in *.page.tmpl
	for _, page := range pages {
		name := filepath.Base(page)
		ts, err := template.New(name).ParseFiles(page)
		if err != nil {
			return cache, err
		}
		matches, err := filepath.Glob(fmt.Sprintf("%s/*.layout.tmpl", pathToTemplates))
		if err != nil {
			return cache, err
		}

		if len(matches) > 0 {
			ts, err = ts.ParseGlob(fmt.Sprintf("%s/*.layout.tmpl", pathToTemplates))
			if err != nil {
				return cache, err
			}
		}
		cache[name] = ts
	}
	return cache, nil
}

/*
// Simple Template Cache. Uncomment this code to use this simple approach.
// If you have more than one layout, it needs to be added manually to the
// "templates" slice in the "createTemplateCache" function

var tc = make(map[string]*template.Template)

// RenderTemplate renders Html Template ** SIMPLE APPROACH **
func RenderTemplate(w http.ResponseWriter, t string) {
	var tmpl *template.Template
	var err error

	// Check if we already have the template in our cache
	_, inMap := tc[t]

	if !inMap {
		// We create a template
		log.Println("Creating template and adding to cache")
		err = createTemplateCache(t)
		if err != nil {
			log.Println("Error parsing templates:", err)
		}
	} else {
		// Template is in the cache
		log.Println("Using cached template")
	}
	tmpl = tc[t]
	err = tmpl.Execute(w, nil)
	if err != nil {
		log.Println("Error parsing templates:", err)
	}
}

func createTemplateCache(t string) error {
	templates := []string{
		fmt.Sprintf("./templates/%s", t),
		"./templates/base.layout.tmpl",
	}
	// Parse the template
	tmpl, err := template.ParseFiles(templates...)

	if err != nil {
		return err
	}
	// Add template to cache
	tc[t] = tmpl
	return nil
}
*/
