import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

public class readXMLmedi {
	public static void main(String[] args) {
		SAXBuilder builder = new SAXBuilder();
		File xml = new File("/Users/gabriel/Dropbox/Workspace/jdom-uebung/src/main/java/medi.xml");
		ArrayList<String> medicaments = new ArrayList<String>();
		
		  try {

				Document document = (Document) builder.build(xml);
				Element rootNode = document.getRootElement();
				List list = rootNode.getChildren("Preparation");
				System.out.println(list.size());

				for (int i = 0; i < list.size(); i++) {
					
				   Element node = (Element) list.get(i);
				   String med_name = node.getChildText("NameDe");
				   med_name = med_name.split("[\\s']")[0];
				   med_name = med_name.replace(".", "").replace(":", "").toLowerCase();
				   if(med_name.length() > 2 && !medicaments.contains(med_name)) {
					   medicaments.add(med_name);
					   System.out.println("added " + med_name + " (" + i + ")");
				   }

				}
				
				  System.out.println("done");
				  System.out.println("size of list: " + medicaments.size());

			  } catch (IOException io) {
				System.out.println(io.getMessage());
			  } catch (JDOMException jdomex) {
				System.out.println(jdomex.getMessage());
			  }
		 String output = "! array potentialmed = ";
		 for(String med : medicaments) {
			 output += med + "|";
		 }
		 System.out.println("\ninsert the following line in your .rive file:");
		 System.out.println(output.substring(0, output.length()-1));
	}
}
