import ObservableStore from 'obs-store';
import log from 'loglevel'

export class PreferencesController {
    constructor(options = {}) {
        const defaults = {
            currentLocale: options.initLangCode || 'en',
            accounts: [],
            selectedAccount: undefined
        };

        const initState = Object.assign({}, defaults, options.initState);
        this.store = new ObservableStore(initState)
    }


    setCurrentLocale(key) {
        this.store.updateState({currentLocale: key})
    }

    addAccount(account) {
        const accounts = this.store.getState().accounts;
        if (!this._getAccountByPk(account.publicKey)) {
            accounts.push(Object.assign({name: `Account ${accounts.length + 1}`}, account));
            this.store.updateState({accounts})
        } else {
            log.log(`Account with public key ${account} already exists`)
        }
    }

    syncAccounts(fromKeyrings) {
        const oldAccounts = this.store.getState().accounts;
        const accounts = fromKeyrings.map((account, i) => {
            return Object.assign(
                {name: `Account ${i + 1}`},
                account,
                oldAccounts.find(oldAcc => oldAcc.publicKey === account.publicKey)
            )
        });
        this.store.updateState({accounts});

        // Ensure we have selected account
        let selectedAccount = this.store.getState().selectedAccount;
        if (!selectedAccount || !accounts.find(account => account.publicKey === selectedAccount)){
            selectedAccount = accounts.length > 0 ? accounts[0].publicKey : undefined;
            this.store.updateState({selectedAccount})
        }
    }

    addLabel(account, label) {
        const accounts = this.store.getState().accounts;
        const index = accounts.findIndex(current => current.publicKey === account.publicKey);
        accounts[index].name = label;
        this.store.updateState({accounts})
    }

    selectAccount(publicKey) {
        //const selectedAccount = this._getAccountByPk(publicKey);
        this.store.updateState({selectedAccount: publicKey})
    }

    _getAccountByPk(publicKey) {
        const accounts = this.store.getState().accounts;
        return accounts.find(account => account.publicKey === publicKey)
    }
}