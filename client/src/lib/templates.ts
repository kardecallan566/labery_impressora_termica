/**
 * Templates - Save and manage label templates
 */

import { Template, TemplateVariable, ZPLElement } from './zpl/types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'labery_templates';

/**
 * Save template to local storage
 */
export function saveTemplate(
  name: string,
  description: string,
  zplCode: string,
  elements: ZPLElement[],
  variables: TemplateVariable[] = []
): Template {
  const template: Template = {
    id: uuidv4(),
    name,
    description,
    zplCode,
    elements,
    variables,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const templates = getAllTemplates();
  templates.push(template);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));

  return template;
}

/**
 * Update existing template
 */
export function updateTemplate(
  id: string,
  updates: Partial<Template>
): Template | null {
  const templates = getAllTemplates();
  const index = templates.findIndex((t) => t.id === id);

  if (index === -1) return null;

  const updated = {
    ...templates[index],
    ...updates,
    updatedAt: new Date(),
  };

  templates[index] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));

  return updated;
}

/**
 * Delete template
 */
export function deleteTemplate(id: string): boolean {
  const templates = getAllTemplates();
  const filtered = templates.filter((t) => t.id !== id);

  if (filtered.length === templates.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Get all templates
 */
export function getAllTemplates(): Template[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load templates:', error);
    return [];
  }
}

/**
 * Get template by ID
 */
export function getTemplate(id: string): Template | null {
  const templates = getAllTemplates();
  return templates.find((t) => t.id === id) || null;
}

/**
 * Search templates by name
 */
export function searchTemplates(query: string): Template[] {
  const templates = getAllTemplates();
  const lowerQuery = query.toLowerCase();

  return templates.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Extract variables from ZPL code
 */
export function extractVariables(zplCode: string): TemplateVariable[] {
  const variables: TemplateVariable[] = [];
  const regex = /\{\{(\w+)\}\}/g;
  const seen = new Set<string>();

  let match;
  while ((match = regex.exec(zplCode)) !== null) {
    const name = match[1];
    if (!seen.has(name)) {
      seen.add(name);
      variables.push({
        name,
        placeholder: `{{${name}}}`,
        type: 'text',
        defaultValue: '',
        required: true,
      });
    }
  }

  return variables;
}

/**
 * Replace variables in ZPL code
 */
export function replaceVariables(
  zplCode: string,
  values: Record<string, string>
): string {
  let result = zplCode;

  for (const [name, value] of Object.entries(values)) {
    const placeholder = `{{${name}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), value);
  }

  return result;
}

/**
 * Validate template variables
 */
export function validateVariables(
  variables: TemplateVariable[],
  values: Record<string, string>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const variable of variables) {
    if (variable.required && !values[variable.name]) {
      errors.push(`Missing required variable: ${variable.name}`);
    }

    if (values[variable.name]) {
      const value = values[variable.name];

      if (variable.type === 'number' && isNaN(Number(value))) {
        errors.push(`Variable ${variable.name} must be a number`);
      }

      if (variable.type === 'date') {
        try {
          new Date(value);
        } catch {
          errors.push(`Variable ${variable.name} must be a valid date`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create label from template
 */
export function createLabelFromTemplate(
  templateId: string,
  variables: Record<string, string>
): { zplCode: string; valid: boolean; errors: string[] } {
  const template = getTemplate(templateId);
  if (!template) {
    return {
      zplCode: '',
      valid: false,
      errors: ['Template not found'],
    };
  }

  const validation = validateVariables(template.variables, variables);
  if (!validation.valid) {
    return {
      zplCode: '',
      valid: false,
      errors: validation.errors,
    };
  }

  const zplCode = replaceVariables(template.zplCode, variables);

  return {
    zplCode,
    valid: true,
    errors: [],
  };
}

/**
 * Export template as JSON
 */
export function exportTemplate(id: string): Blob | null {
  const template = getTemplate(id);
  if (!template) return null;

  const json = JSON.stringify(template, null, 2);
  return new Blob([json], { type: 'application/json' });
}

/**
 * Import template from JSON
 */
export function importTemplate(json: string): Template | null {
  try {
    const data = JSON.parse(json);

    // Validate required fields
    if (!data.name || !data.zplCode) {
      throw new Error('Invalid template format');
    }

    const template: Template = {
      id: uuidv4(),
      name: data.name,
      description: data.description || '',
      zplCode: data.zplCode,
      elements: data.elements || [],
      variables: data.variables || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const templates = getAllTemplates();
    templates.push(template);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));

    return template;
  } catch (error) {
    console.error('Failed to import template:', error);
    return null;
  }
}

/**
 * Clear all templates
 */
export function clearAllTemplates(): void {
  localStorage.removeItem(STORAGE_KEY);
}
