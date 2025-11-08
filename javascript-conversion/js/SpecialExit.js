class SpecialExit {
    constructor(action, target, leadsTo) {
        this.action = action;
        this.target = target;
        this.leadsTo = leadsTo;
    }

    getAction() {
        return this.action;
    }

    getTarget() {
        return this.target;
    }

    getLeadsTo() {
        return this.leadsTo;
    }
}