DELETE FROM DB.DBA.load_list;
ld_dir('/ext/dbpedia', '*.ttl', 'http://dbpedia.org');
ld_dir('/ext/dbpedia', '*.owl', 'http://dbpedia.org');
SELECT * FROM DB.DBA.load_list;
rdf_loader_run();
checkpoint;
