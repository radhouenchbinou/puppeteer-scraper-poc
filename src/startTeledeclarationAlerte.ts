import {Page} from 'puppeteer';


export const showAlert = async (page: Page, message: string, closeable: boolean) => {
    await page.evaluate(
        (msg, canClose) => {
            const modal = document.createElement('div');
            modal.id = 'custom-alert';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            modal.style.zIndex = '9999';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';

            const content = document.createElement('div');
            content.style.backgroundColor = 'white';
            content.style.padding = '40px';
            content.style.borderRadius = '10px';
            content.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
            content.style.fontSize = '20px';
            content.style.maxWidth = '600px';
            content.style.textAlign = 'center';

            const text = document.createElement('div');
            text.textContent = msg;
            content.appendChild(text);

            if (canClose) {
                const button = document.createElement('button');
                button.textContent = 'Fermer';
                button.style.marginTop = '20px';
                button.style.padding = '10px 20px';
                button.style.fontSize = '16px';
                button.style.cursor = 'pointer';
                button.onclick = () => modal.remove();
                content.appendChild(button);
            }

            modal.appendChild(content);
            document.body.appendChild(modal);
        },
        message,
        closeable
    );
};
export const closeAlert = async (page: Page) => {
    await page.evaluate(() => {
        const modal = document.getElementById('custom-alert');
        if (modal) {
            modal.remove();
        }
    });
}


export const confirmationModal = async (page: Page) =>
    page.evaluate(() => {
        return new Promise<boolean>(resolve => {
            const modal = document.createElement('div');
            modal.id = 'custom-confirm';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0,0,0,0.6)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '9999';

            const box = document.createElement('div');
            box.style.backgroundColor = 'white';
            box.style.padding = '30px';
            box.style.borderRadius = '10px';
            box.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
            box.style.textAlign = 'center';

            const msg = document.createElement('div');
            msg.textContent = 'Voulez-vous soumettre le formulaire ?';
            msg.style.marginBottom = '20px';
            msg.style.fontSize = '18px';

            const confirmBtn = document.createElement('button');
            confirmBtn.textContent = 'Confirmer';
            confirmBtn.style.marginRight = '15px';
            confirmBtn.style.padding = '10px 20px';
            confirmBtn.style.cursor = 'pointer';

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Annuler';
            cancelBtn.style.padding = '10px 20px';
            cancelBtn.style.cursor = 'pointer';

            confirmBtn.onclick = () => {
                modal.remove();
                resolve(true);
            };

            cancelBtn.onclick = () => {
                modal.remove();
                resolve(false);
            };

            box.appendChild(msg);
            box.appendChild(confirmBtn);
            box.appendChild(cancelBtn);
            modal.appendChild(box);
            document.body.appendChild(modal);
        });
    });

export default {};
