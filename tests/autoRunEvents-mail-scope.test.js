/*
 * Unified-manifest autorun (event-based activation) is currently supported only
 * for Outlook. These tests lock in that "extensions.autoRunEvents" is accepted
 * only when the extension targets the "mail" scope, so that unsupported
 * Word/Excel/PowerPoint autorun events (for example "onDocumentOpened") are
 * reported at validation time instead of being silently ignored at runtime.
 */

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const Ajv = require('ajv');

const schema = require('../MicrosoftTeams.schema.json');

const CONSTRAINT_NAME = 'extensionAutoRunEventsMailScopeConstraint';

function createValidator() {
  // Ajv does not ship the draft-04 meta-schema, and this schema already relies
  // on draft-06+ keywords such as "const", "if"/"then", and "contains", so it is
  // compiled without the declared meta-schema reference.
  const { $schema: declaredMetaSchema, ...schemaWithoutMetaSchema } = schema;
  assert.ok(declaredMetaSchema, 'the schema should declare a $schema value');

  const ajv = new Ajv({ strict: false, allErrors: true });
  return ajv.compile(schemaWithoutMetaSchema);
}

const validate = createValidator();

function manifestWith(extension) {
  return {
    $schema: 'https://developer.microsoft.com/json-schemas/teams/v1.30/MicrosoftTeams.schema.json',
    manifestVersion: '1.30',
    version: '1.0.0',
    id: 'c6c1f32b-5e6d-4ad8-9c1e-b8f8a3a7a1a0',
    developer: {
      name: 'Contoso',
      websiteUrl: 'https://www.contoso.com',
      privacyUrl: 'https://www.contoso.com/privacy',
      termsOfUseUrl: 'https://www.contoso.com/termsofuse'
    },
    name: {
      short: 'Contoso add-in',
      full: 'Contoso add-in for Microsoft 365'
    },
    description: {
      short: 'Contoso add-in.',
      full: 'A Contoso add-in used to exercise schema validation.'
    },
    icons: {
      outline: 'assets/outline.png',
      color: 'assets/color.png'
    },
    accentColor: '#230201',
    extensions: [extension]
  };
}

function mailAutoRunEvents() {
  return [
    {
      events: [
        {
          type: 'newMessageComposeCreated',
          actionId: 'onNewMessageComposeHandler'
        }
      ]
    }
  ];
}

function autoRunEventsWithType(type) {
  return [
    {
      events: [
        {
          type,
          actionId: 'onDocumentOpenedHandler'
        }
      ]
    }
  ];
}

function scopeErrors(errors) {
  return (errors || []).filter((error) => error.schemaPath.includes(CONSTRAINT_NAME));
}

function assertRejectedByScopeConstraint(manifest, message) {
  assert.equal(validate(manifest), false, message);
  assert.ok(
    scopeErrors(validate.errors).length > 0,
    `${message}: expected an error raised by ${CONSTRAINT_NAME}, got ` +
      JSON.stringify(validate.errors)
  );
}

function assertValid(manifest, message) {
  const isValid = validate(manifest);
  assert.equal(isValid, true, `${message}: ${JSON.stringify(validate.errors)}`);
}

test('the mail scope on the extension allows autoRunEvents', () => {
  assertValid(
    manifestWith({
      requirements: {
        capabilities: [{ name: 'Mailbox', minVersion: '1.10' }],
        scopes: ['mail']
      },
      autoRunEvents: mailAutoRunEvents()
    }),
    'an Outlook extension should be able to declare autoRunEvents'
  );
});

test('the mail scope on each autoRunEvents entry allows autoRunEvents', () => {
  assertValid(
    manifestWith({
      requirements: {
        capabilities: [{ name: 'Mailbox', minVersion: '1.10' }]
      },
      autoRunEvents: [
        {
          requirements: {
            capabilities: [{ name: 'Mailbox', minVersion: '1.10' }],
            scopes: ['mail']
          },
          events: [
            {
              type: 'newMessageComposeCreated',
              actionId: 'onNewMessageComposeHandler'
            }
          ]
        }
      ]
    }),
    'the mail scope may be declared on the autoRunEvents entry instead of the extension'
  );
});

test('an extension targeting both mail and a document scope allows autoRunEvents', () => {
  assertValid(
    manifestWith({
      requirements: {
        scopes: ['mail', 'document']
      },
      autoRunEvents: mailAutoRunEvents()
    }),
    'autorun should stay valid for a multi-host extension that still targets Outlook'
  );
});

test('the document scope with onDocumentOpened is rejected', () => {
  assertRejectedByScopeConstraint(
    manifestWith({
      requirements: {
        scopes: ['document']
      },
      autoRunEvents: autoRunEventsWithType('onDocumentOpened')
    }),
    'Word autorun is not supported by the unified manifest'
  );
});

test('the workbook scope with autoRunEvents is rejected', () => {
  assertRejectedByScopeConstraint(
    manifestWith({
      requirements: {
        scopes: ['workbook']
      },
      autoRunEvents: autoRunEventsWithType('onDocumentOpened')
    }),
    'Excel autorun is not supported by the unified manifest'
  );
});

test('the presentation scope with autoRunEvents is rejected', () => {
  assertRejectedByScopeConstraint(
    manifestWith({
      requirements: {
        scopes: ['presentation']
      },
      autoRunEvents: autoRunEventsWithType('onDocumentOpened')
    }),
    'PowerPoint autorun is not supported by the unified manifest'
  );
});

test('autoRunEvents without any declared scope is rejected', () => {
  assertRejectedByScopeConstraint(
    manifestWith({
      requirements: {
        capabilities: [{ name: 'Mailbox', minVersion: '1.10' }]
      },
      autoRunEvents: mailAutoRunEvents()
    }),
    'the mail scope has to be declared explicitly to use autorun'
  );
});

test('an autoRunEvents entry narrowed to a non-mail scope is rejected', () => {
  assertRejectedByScopeConstraint(
    manifestWith({
      requirements: {
        scopes: ['mail', 'document']
      },
      autoRunEvents: [
        {
          requirements: {
            scopes: ['document']
          },
          events: [
            {
              type: 'onDocumentOpened',
              actionId: 'onDocumentOpenedHandler'
            }
          ]
        }
      ]
    }),
    'an autorun entry may not be narrowed to a scope where autorun is unsupported'
  );
});

test('an extension without autoRunEvents is unaffected', () => {
  assertValid(
    manifestWith({
      requirements: {
        scopes: ['document', 'workbook', 'presentation']
      },
      ribbons: [
        {
          contexts: ['default'],
          tabs: [
            {
              builtInTabId: 'TabHome',
              groups: [
                {
                  id: 'contosoGroup',
                  label: 'Contoso',
                  icons: [
                    { size: 16, url: 'https://www.contoso.com/assets/icon-16.png' },
                    { size: 32, url: 'https://www.contoso.com/assets/icon-32.png' },
                    { size: 80, url: 'https://www.contoso.com/assets/icon-80.png' }
                  ],
                  controls: [
                    {
                      id: 'contosoButton',
                      type: 'button',
                      label: 'Show task pane',
                      icons: [
                        { size: 16, url: 'https://www.contoso.com/assets/icon-16.png' },
                        { size: 32, url: 'https://www.contoso.com/assets/icon-32.png' },
                        { size: 80, url: 'https://www.contoso.com/assets/icon-80.png' }
                      ],
                      supertip: {
                        title: 'Show task pane',
                        description: 'Opens the Contoso task pane.'
                      },
                      actionId: 'showTaskPane'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }),
    'Word, Excel, and PowerPoint extensions without autorun must keep validating'
  );
});

test('the constraint explains that autorun is supported only for Outlook', () => {
  const constraint = schema.definitions[CONSTRAINT_NAME];

  assert.ok(constraint, `${CONSTRAINT_NAME} should be defined in the schema`);
  assert.match(constraint.title, /Outlook/);
  assert.match(constraint.title, /'mail'/);
  assert.match(constraint.description, /Outlook/);
  assert.match(constraint.description, /'mail'/);
  assert.match(constraint.description, /autoRunEvents/);
  assert.match(constraint.description, /ignored at runtime/);
});
