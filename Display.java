import java.awt.*;
import java.applet.*;

public class Display extends Applet {
       	// Create a Grid Bag layout.
        GridBagLayout gridbag = new GridBagLayout();
        GridBagConstraints constraints = new GridBagConstraints();
        setLayout( gridbag );

        // Create a non-editable Text Area for game output.
        buildConstraints( constraints, 0,0, 2,1, 100,100 );
        constraints.fill = GridBagConstraints.BOTH;
	desc = new TextArea( "Welcome, foolish mortal.\n", 10, 80, TextArea.SCROLLBARS_VERTICAL_ONLY );
        desc.setEditable( false );
        gridbag.setConstraints( desc, constraints );
        add( desc );

        // Create a Text Label.
        buildConstraints( constraints, 0,1, 1,1, 0,0 );
        constraints.anchor = GridBagConstraints.EAST;
        Label label = new Label( "What do you want to do now? ", Label.LEFT );
        gridbag.setConstraints( label, constraints );
        add( label );
        
        // Create a Text Field for user input.
        buildConstraints( constraints, 1,1, 1,1, 100,0 );
        constraints.fill = GridBagConstraints.HORIZONTAL;
	input = new TextField();
        // And create a Listener to detect when the user types something.
        input.addActionListener( new TextAction() );
        gridbag.setConstraints( input, constraints );
        add( input );
        constraints.fill = GridBagConstraints.BOTH;
        
        // requestFocus();
    }

    public void buildConstraints( GridBagConstraints gbc, int gx, int gy,
                                    int gw, int gh, int wx, int wy ) {
        gbc.gridx = gx;
        gbc.gridy = gy;
        gbc.gridwidth = gw;
        gbc.gridheight = gh;
        gbc.weightx = wx;
        gbc.weighty = wy;
    }
    
    // Add padding around the stuff in this frame window thingie.
    public Insets getInsets() {
        return new Insets( 10, 10, 10, 10 );
    }

    public void paint (Graphics g) {
    }
}
