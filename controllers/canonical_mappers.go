package controllers

import "github.com/Theodor-Springmann-Stiftung/musenalm/canonical"

func canonicalEntryInput(payload *almanachEditPayload, editorID string) canonical.EntryInput {
	return canonical.EntryInput{
		PreferredTitle:    payload.Entry.PreferredTitle,
		Title:             payload.Entry.Title,
		ParallelTitle:     payload.Entry.ParallelTitle,
		Subtitle:          payload.Entry.Subtitle,
		VariantTitle:      payload.Entry.VariantTitle,
		Incipit:           payload.Entry.Incipit,
		Responsibility:    payload.Entry.ResponsibilityStatement,
		Pseudonym:         payload.Entry.Pseudonym,
		Publication:       payload.Entry.PublicationStatement,
		PlaceStatement:    payload.Entry.PlaceStatement,
		Edition:           payload.Entry.Edition,
		Annotation:        payload.Entry.Annotation,
		Comment:           payload.Entry.EditComment,
		Extent:            payload.Entry.Extent,
		Dimensions:        payload.Entry.Dimensions,
		References:        payload.Entry.References,
		Status:            payload.Entry.Status,
		Year:              payload.Entry.Year,
		Languages:         payload.Languages,
		Places:            payload.Places,
		PreferredSeriesID: payload.PreferredSeriesID,
		EditorID:          editorID,
	}
}

func canonicalItemInputs(items []almanachItemPayload) []canonical.ItemInput {
	result := make([]canonical.ItemInput, 0, len(items))
	for _, item := range items {
		result = append(result, canonical.ItemInput{
			ID:         item.ID,
			Owner:      item.Owner,
			Identifier: item.Identifier,
			Location:   item.Location,
			Media:      item.Media,
			Annotation: item.Annotation,
			URI:        item.URI,
		})
	}
	return result
}

func canonicalRelationInputs(relations []almanachRelationPayload) []canonical.RelationInput {
	result := make([]canonical.RelationInput, 0, len(relations))
	for _, relation := range relations {
		result = append(result, canonical.RelationInput{
			ID:        relation.ID,
			TargetID:  relation.TargetID,
			Type:      relation.Type,
			Uncertain: relation.Uncertain,
		})
	}
	return result
}

func canonicalNewRelationInputs(relations []almanachNewRelationPayload) []canonical.RelationInput {
	result := make([]canonical.RelationInput, 0, len(relations))
	for _, relation := range relations {
		result = append(result, canonical.RelationInput{
			TargetID:  relation.TargetID,
			Type:      relation.Type,
			Uncertain: relation.Uncertain,
		})
	}
	return result
}

func canonicalContentInput(input contentFormInput, editorID string) canonical.ContentInput {
	return canonical.ContentInput{
		PreferredTitle: input.PreferredTitle,
		VariantTitle:   input.VariantTitle,
		ParallelTitle:  input.ParallelTitle,
		Title:          input.TitleStatement,
		Subtitle:       input.SubtitleStatement,
		Incipit:        input.IncipitStatement,
		Responsibility: input.ResponsibilityStatement,
		Pseudonym:      input.Pseudonym,
		PlaceStatement: input.PlaceStatement,
		Extent:         input.Extent,
		Annotation:     input.Annotation,
		Comment:        input.EditComment,
		Language:       input.Language,
		ContentTypes:   input.ContentType,
		MusenalmTypes:  input.MusenalmType,
		Pagination:     input.MusenalmPagination,
		Status:         input.EditState,
		Numbering:      input.Numbering,
		EditorID:       editorID,
	}
}

func canonicalContentRelationsInput(payload contentAgentRelationsPayload) ([]canonical.RelationInput, []canonical.RelationInput) {
	relations := make([]canonical.RelationInput, 0, len(payload.Relations))
	for _, relation := range payload.Relations {
		relations = append(relations, canonical.RelationInput{
			ID:        relation.ID,
			TargetID:  relation.TargetID,
			Type:      relation.Type,
			Uncertain: relation.Uncertain,
		})
	}

	newRelations := make([]canonical.RelationInput, 0, len(payload.NewRelations))
	for _, relation := range payload.NewRelations {
		newRelations = append(newRelations, canonical.RelationInput{
			TargetID:  relation.TargetID,
			Type:      relation.Type,
			Uncertain: relation.Uncertain,
		})
	}

	return relations, newRelations
}
