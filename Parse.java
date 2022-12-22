import java.util.StringTokenizer;

public class Parse {
    private String verb = null;
    private String noun = null;

    public void parse(String s) {
        StringTokenizer st = new StringTokenizer(s);
        while (st.hasMoreTokens()) {
            String next = st.nextToken();
            if (verb==null) {
                verb=next;
            } else {
                noun=next;
            }
        }
    }
    
    public String getNoun()
    {
        return noun;
    }
    public String getVerb()
    {
        return verb;
    }
}
