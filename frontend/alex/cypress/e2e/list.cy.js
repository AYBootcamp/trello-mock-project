/* global cy */

describe('e2e test list', () => {
    const CYPRESS_TEST_NEW_LIST_TITLE = 'New list title created from Cypress!'
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
        // wait 3 seconds for data fetching
        cy.wait(3000)
    })

    it('can create list', () => {
        // click create new list button to enter edit mode
        cy.get('[data-test=add-new-list-btn]').click()

        // type the test title into input
        cy.get('[data-test=new-list-title-input').type(
            CYPRESS_TEST_NEW_LIST_TITLE
        )

        // create the new list by clicking the create button (or enter key)
        cy.get('[data-test=confirm-create-new-list-btn').click()
    })

    it('can delete list', () => {
        // scroll to the end of page
        cy.contains(CYPRESS_TEST_NEW_LIST_TITLE).scrollIntoView()
        cy.contains(CYPRESS_TEST_NEW_LIST_TITLE).should(
            'have.length.at.least',
            1
        )

        // open the list action for list with text 'New list title created from Cypress!'
        cy.contains(CYPRESS_TEST_NEW_LIST_TITLE)
            .parent()
            .find('[data-test=list-action-dropdown-btn]')
            .click()

        // click trash icon and then click confirm to delete
        cy.get('[data-test=list-action-delete-btn]').click()
        cy.get('[data-test=dialog-confirm]').click()
    })
})
