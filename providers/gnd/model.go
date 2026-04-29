package gnd

import "fmt"

type Person struct {
	KGPZID                              string             `json:"kgpzid"`
	KGPZURL                             string             `json:"kgpzurl"`
	URL                                 string             `json:"id,omitempty"`
	DateOfBirth                         []string           `json:"dateOfBirth,omitempty"`
	PlaceOfBirth                        []Entity           `json:"placeOfBirth,omitempty"`
	DateOfDeath                         []string           `json:"dateOfDeath,omitempty"`
	PlaceOfDeath                        []Entity           `json:"placeOfDeath,omitempty"`
	PlaceOfBirthAsLiteral               []string           `json:"placeOfBirthAsLiteral,omitempty"`
	PlaceOfDeathAsLiteral               []string           `json:"placeOfDeathAsLiteral,omitempty"`
	BiographicalOrHistoricalInformation []string           `json:"biographicalOrHistoricalInformation,omitempty"`
	PreferredName                       string             `json:"preferredName,omitempty"`
	GndIdentifier                       string             `json:"gndIdentifier,omitempty"`
	Wikipedia                           []Entity           `json:"wikipedia,omitempty"`
	Depiction                           []Picture          `json:"depiction,omitempty"`
	ProfessionOrOccupation              []Entity           `json:"professionOrOccupation,omitempty"`
	PreferredNameEntityForThePerson     PersonNameEntity   `json:"preferredNameEntityForThePerson,omitempty"`
	VariantNameEntityForThePerson       []PersonNameEntity `json:"variantNameEntityForThePerson,omitempty"`
	VariantName                         []string           `json:"variantName,omitempty"`
	SameAs                              []CrossReferences  `json:"sameAs,omitempty"`
	Pseudonym                           []Entity           `json:"pseudonym,omitempty"`
	GNDSubjectCategory                  []Entity           `json:"gndSubjectCategory,omitempty"`
	Type                                []string           `json:"type,omitempty"`
	PlaceOfActivity                     []Entity           `json:"placeOfActivity,omitempty"`
}

type CrossReferences struct {
	Items Collection `json:"collection,omitempty"`
	ID    string     `json:"id,omitempty"`
}

type Collection struct {
	Abbr      string `json:"abbr,omitempty"`
	Name      string `json:"name,omitempty"`
	Publisher string `json:"publisher,omitempty"`
	Icon      string `json:"icon,omitempty"`
	ID        string `json:"id,omitempty"`
}

type Link struct {
	ID    string `json:"id,omitempty"`
	Label string `json:"label,omitempty"`
}

type Picture struct {
	ID        string `json:"id,omitempty"`
	URL       string `json:"url,omitempty"`
	Thumbnail string `json:"thumbnail,omitempty"`
}

type Entity struct {
	ID    string `json:"id,omitempty"`
	Label string `json:"label,omitempty"`
}

type PersonNameEntity struct {
	Prefix       []string `json:"prefix,omitempty"`
	Counting     []string `json:"counting,omitempty"`
	Forename     []string `json:"forename,omitempty"`
	Surname      []string `json:"surname,omitempty"`
	PersonalName []string `json:"personalName,omitempty"`
	NameAddition []string `json:"nameAddition,omitempty"`
}

func (p Person) String() string {
	return fmt.Sprintf("Person{KGPZID: %v, URL: %v, DateOfDeath: %v, PlaceOfDeath: %v, BiographicalOrHistoricalInformation: %v, PreferredName: %v, GndIdentifier: %v, Wikipedia: %v, Depiction: %v, ProfessionOrOccupation: %v, PreferredNameEntityForThePerson: %v, DateOfBirth: %v, PlaceOfBirth: %v, VariantNameEntityForThePerson: %v, VariantName: %v, SameAs: %v}", p.KGPZID, p.URL, p.DateOfDeath, p.PlaceOfDeath, p.BiographicalOrHistoricalInformation, p.PreferredName, p.GndIdentifier, p.Wikipedia, p.Depiction, p.ProfessionOrOccupation, p.PreferredNameEntityForThePerson, p.DateOfBirth, p.PlaceOfBirth, p.VariantNameEntityForThePerson, p.VariantName, p.SameAs)
}

func (p Person) Name() string {
	return p.PreferredName
}

func (p Person) SameAsDeduped() []CrossReferences {
	seen := make(map[string]struct{}, len(p.SameAs))
	result := make([]CrossReferences, 0, len(p.SameAs))
	for _, ref := range p.SameAs {
		key := ref.Items.Abbr
		if key == "" {
			key = ref.ID
		}
		if _, exists := seen[key]; !exists {
			seen[key] = struct{}{}
			result = append(result, ref)
		}
	}
	return result
}

var sameAsPriority = map[string]int{"ADB": 0, "NDB": 1, "dewiki": 2}

func (p Person) SameAsSorted() []CrossReferences {
	deduped := p.SameAsDeduped()
	priority := make([]CrossReferences, 3)
	rest := make([]CrossReferences, 0, len(deduped))
	for _, ref := range deduped {
		if i, ok := sameAsPriority[ref.Items.Abbr]; ok {
			priority[i] = ref
		} else {
			rest = append(rest, ref)
		}
	}
	result := make([]CrossReferences, 0, len(deduped))
	for _, ref := range priority {
		if ref.ID != "" {
			result = append(result, ref)
		}
	}
	return append(result, rest...)
}
