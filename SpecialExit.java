public class SpecialExit
{
    private String 	action;
    private String	target;
    private Location	leadsTo;

    // Default constructor.
    SpecialExit( String action, String target, Location leadsTo )
    {
        this.action = action;
        this.target = target;
        this.leadsTo = leadsTo;
    }
    public String getAction()
    {
        return action;
    }
    public String getTarget()
    {
        return target;
    }
    public Location getLeadsTo()
    {
        return leadsTo;
    }
}

