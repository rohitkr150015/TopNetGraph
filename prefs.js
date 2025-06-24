const { Adw, Gtk, Gio, GObject } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;

function init() {
}

function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.topnetgraph');
    
    const page = new Adw.PreferencesPage({
        title: 'TopNetGraph',
        icon_name: 'network-wired-symbolic',
    });
    window.add(page);

    // Graph Settings Group
    const graphGroup = new Adw.PreferencesGroup({
        title: 'Graph Settings',
        description: 'Customize the appearance of the network traffic graph',
    });
    page.add(graphGroup);

    // Graph Type
    const graphTypeRow = new Adw.ComboRow({
        title: 'Graph Type',
        subtitle: 'Choose how the network traffic is displayed',
    });
    
    const graphTypeModel = new Gtk.StringList();
    graphTypeModel.append('Line Graph');
    graphTypeModel.append('Filled Areas');
    graphTypeRow.set_model(graphTypeModel);
    
    settings.bind('graph-type', graphTypeRow, 'selected', 
        Gio.SettingsBindFlags.DEFAULT);
    
    graphGroup.add(graphTypeRow);

    // Network Interface
    const interfaceRow = new Adw.EntryRow({
        title: 'Network Interface',
        text: settings.get_string('network-interface'),
    });
    
    interfaceRow.connect('changed', () => {
        settings.set_string('network-interface', interfaceRow.get_text());
    });
    
    graphGroup.add(interfaceRow);

    // Update Interval
    const intervalRow = new Adw.SpinRow({
        title: 'Update Interval (ms)',
        subtitle: 'How often to refresh the graph data',
        adjustment: new Gtk.Adjustment({
            lower: 100,
            upper: 2000,
            step_increment: 100,
            value: settings.get_int('update-interval'),
        }),
    });
    
    settings.bind('update-interval', intervalRow, 'value',
        Gio.SettingsBindFlags.DEFAULT);
    
    graphGroup.add(intervalRow);

    // Display Settings Group
    const displayGroup = new Adw.PreferencesGroup({
        title: 'Display Settings',
        description: 'Control what information is shown',
    });
    page.add(displayGroup);

    // Show Upload
    const showUploadRow = new Adw.SwitchRow({
        title: 'Show Upload Traffic',
        subtitle: 'Display upload speed in the graph',
    });
    
    settings.bind('show-upload', showUploadRow, 'active',
        Gio.SettingsBindFlags.DEFAULT);
    
    displayGroup.add(showUploadRow);

    // Show Download  
    const showDownloadRow = new Adw.SwitchRow({
        title: 'Show Download Traffic',
        subtitle: 'Display download speed in the graph',
    });
    
    settings.bind('show-download', showDownloadRow, 'active',
        Gio.SettingsBindFlags.DEFAULT);
    
    displayGroup.add(showDownloadRow);
}